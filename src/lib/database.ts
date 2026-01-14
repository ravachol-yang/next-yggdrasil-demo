import {Profile, Skin, Texture, User} from "@/lib/types";
import {signProperty} from "@/lib/util";

const USERS: User[] = [
    {id: "00000000-0000-0000-0000-000000000001",
        email: "alice@example.com",
        password: "123456" },
    { id: "00000000-0000-0000-0000-000000000002",
        email: "bob@example.com",
        password: "654321"},
];

const PROFILES: Profile[] = [
    {id: "00000000-0000-0000-0000-000000000003",
        owner:"00000000-0000-0000-0000-000000000001",
        name: "Alice",
        skinId: 1},
    {id: "00000000-0000-0000-0000-000000000004",
        owner:"00000000-0000-0000-0000-000000000002",
        name: "Bob",
        skinId: 2},
    {id: "00000000-0000-0000-0000-000000000005",
        owner:"00000000-0000-0000-0000-000000000002",
        name: "Carol",
        skinId: 3},
]

const SKINS: Skin[] = [
    {id: 1,
        url: process.env.SKIN_URL+"/textures/063244a449f0cd3e8ce348afdfcc575337f03da79c93b78210f5eaf7deea4e94.png",
        metadata: {model: "slim"}
    },
    {id: 2,
        url: process.env.SKIN_URL+"/textures/c826deba422fc0adedf2c9d9f9fb8995eecdd92f28b5754c0e82390d2b3f88bb.png",
        metadata: {model: "default"}
    },
    {id: 3,
        url: process.env.SKIN_URL+"/textures/bee257ddb00915e4f4cf1bed803cce891e35873be7ae6d69f0e270d532471be1.png",
        metadata: {model: "slim"}
    }
]

export const DB = {

    getUserByEmail(email: string): User | undefined {
        return USERS.find(user => user.email === email);
    },

    getUserById(id: string): User | undefined {
        return USERS.find(user => user.id === id);
    },

    getAvailableProfiles(owner: string): Profile[] {
        return PROFILES.filter(profile => profile.owner === owner);
    },

    getProfileById(id: string): Profile | undefined {
        return PROFILES.find(profile => profile.id.replace(/-/g, '')=== id);
    },

    getProfileByIdWithProperties(id: string): Profile | undefined {
        const originalProfile = this.getProfileById(id);
        if (!originalProfile) {return undefined}

        const profile = { ...originalProfile }

        if (profile.skinId) {
            const skin = DB.getSkinById(profile.skinId);
            if (skin) {
                const texture: Texture = {
                    timestamp: Date.now(),
                    profileId: profile.id.replace(/-/g, ''),
                    profileName: profile.name,
                    textures: {
                        SKIN: {...skin, id: undefined}
                    }
                }

                const value = Buffer.from(JSON.stringify(texture)).toString("base64")

                const signature = signProperty(value)
                const property= {name: "textures", value, signature};
                profile.properties = [property];
            }
        }

        profile.id = profile.id.replace(/-/g, '');

        return profile;
    },

    getSkinById(id: number): Skin | undefined {
        return SKINS.find(skin => skin.id === id);
    }
}