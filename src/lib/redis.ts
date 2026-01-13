import { Redis } from '@upstash/redis'
import { Redis as IOREdis } from 'ioredis'

const isLocal = process.env.NODE_ENV === 'development';

export const redis = isLocal?
    new IOREdis(process.env.REDIS_URL || 'redis://localhost:6379')
    : Redis.fromEnv()