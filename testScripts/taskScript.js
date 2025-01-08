import mongoose from 'mongoose';
import PlatformTaskModel  from '../models/taskDetails.model.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/testdb')
    .then(() => {
        console.log('Database connection successful');

        // Define tasks for dry run
        const tasks = [
            {
                platformType: 'TWITTER',
                taskSubType: 'TWITTER_USERINFO',
                claimedDate: new Date(),
                accountUsername: 'user1',
                walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
                securedSharedData: {
                    userName: 'user1',
                    followers: 100,
                    following: 50,
                    posts: 10
                }
            },
            {
                platformType: 'YOUTUBE',
                taskSubType: 'YOUTUBE_WATCH_HISTORY',
                claimedDate: new Date(),
                accountUsername: 'user2',
                walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
                securedSharedData: {
                    avgDailyWatchHours: 2,
                    watchContents: ['video1', 'video2']
                }
            },
            {
                platformType: 'FACEBOOK',
                taskSubType: 'FACEBOOK_ANALYTICS',
                claimedDate: new Date(),
                accountUsername: 'user3',
                walletAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdef',
                securedSharedData: {
                    pageLikes: 500,
                    postEngagement: 200,
                    impressions: 1000
                }
            }
        ];

        // Save tasks and handle validation
        return Promise.all(tasks.map(task => {
            const taskInstance = new PlatformTaskModel(task);
            return taskInstance.save()
                .then(doc => {
                    console.log('Task saved:', doc);
                })
                .catch(err => {
                    console.error('Error saving task:', err.message);
                });
        }));
    })
    .then(() => {
        console.log('Dry run completed');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });