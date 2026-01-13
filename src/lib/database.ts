import {Profile, User} from "@/lib/types";

const USERS: User[] = [
    {id: "00000000-0000-0000-0000-000000000001",
        email: "alice@example.com",
        password: "123456" },
    { id: "00000000-0000-0000-0000-000000000002",
        email: "bob@example.com",
        password: "654321" },
];

const PROFILES: Profile[] = [
    {id: "00000000-0000-0000-0000-000000000003",
        owner:"00000000-0000-0000-0000-000000000001",
        name: "Alice"},
    {id: "00000000-0000-0000-0000-000000000004",
        owner:"00000000-0000-0000-0000-000000000002",
        name: "Bob"},
    {id: "00000000-0000-0000-0000-000000000005",
        owner:"00000000-0000-0000-0000-000000000002",
        name: "Carol"},
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
    }

}