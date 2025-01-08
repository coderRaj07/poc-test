// import mongoose from "mongoose";

// // Define enums for platform type and task subtypes
// export const PLATFORM_TYPES = ["YOUTUBE", "TWITTER", "FACEBOOK"];

// // Must enter the array values at the end of the array, order matters here
// export const PLATFORM_TASK_SUBTYPES = {
//   YOUTUBE: ["YOUTUBE_WATCH_HISTORY", "YOUTUBE_ANALYTICS"],
//   TWITTER: ["TWITTER_USERINFO", "TWITTER_ANALYTICS"],
//   FACEBOOK: ["FACEBOOK_USERINFO", "FACEBOOK_ANALYTICS"],
// };

// export const ETaskType = {
//   NETFLIX: "Netflix",
//   SPOTIFY: "Spotify",
//   AMAZON: "Amazon",
//   TWITTER: "Twitter",
//   YOUTUBE: "Youtube",
//   FARCASTER: "Farcaster",
// }

// export const ETaskDataType = {
//   YOUTUBE_HISTORY: 'YOUTUBE_HISTORY',
//   YOUTUBE_PLAYLIST: 'YOUTUBE_PLAYLIST',
//   YOUTUBE_SUBSCRIBERS: 'YOUTUBE_SUBSCRIBERS',
//   AMAZON_PRIME_VIDEO: 'AMAZON_PRIME_VIDEO',
//   AMAZON_ORDER_HISTORY: 'AMAZON_ORDER_HISTORY',
//   SPOTIFY_PLAYLIST: 'SPOTIFY_PLAYLIST',
//   SPOTIFY_HISTORY: 'SPOTIFY_HISTORY',
//   NETFLIX_HISTORY: 'NETFLIX_HISTORY',
//   NETFLIX_FAVORITE: 'NETFLIX_FAVORITE',
//   TWITTER_USERINFO: 'TWITTER_USERINFO',
//   FARCASTER_USERINFO: 'FARCASTER_USERINFO',
// }

// const taskDataTypeMapping = {
//   [ETaskType.NETFLIX]: [
//     ETaskDataType.NETFLIX_HISTORY,
//     ETaskDataType.NETFLIX_FAVORITE,
//   ],
//   [ETaskType.SPOTIFY]: [
//     ETaskDataType.SPOTIFY_PLAYLIST,
//     ETaskDataType.SPOTIFY_HISTORY,
//   ],
//   [ETaskType.AMAZON]: [
//     ETaskDataType.AMAZON_PRIME_VIDEO,
//     ETaskDataType.AMAZON_ORDER_HISTORY,
//   ],
//   [ETaskType.TWITTER]: [
//     ETaskDataType.TWITTER_USERINFO,
//   ],
//   [ETaskType.YOUTUBE]: [
//     ETaskDataType.YOUTUBE_HISTORY,
//     ETaskDataType.YOUTUBE_PLAYLIST,
//     ETaskDataType.YOUTUBE_SUBSCRIBERS,
//   ],
//   [ETaskType.FARCASTER]: [
//     ETaskDataType.FARCASTER_USERINFO,
//   ],
// };

// // Map task subtypes to specific schema definitions for securedSharedData
// const TASK_SUBTYPE_SCHEMAS = {
//   YOUTUBE_WATCH_HISTORY: {
//     avgDailyWatchHours: { type: Number, required: true },
//     watchContents: { type: [String], required: true },
//   },
//   YOUTUBE_ANALYTICS: {
//     subscribers: { type: Number },
//     totalViews: { type: Number },
//   },
//   TWITTER_USERINFO: {
//     userName: { type: String },
//     followers: { type: Number },
//     following: { type: Number },
//     posts: { type: Number },
//   },
//   FACEBOOK_ANALYTICS: {
//     pageLikes: { type: Number },
//     postEngagement: { type: Number },
//     impressions: { type: Number },
//   },
//   // Add more task subtypes and their schemas as needed
// };

// // Task schema definition related to platforms
// const PlatformTaskSchema = new mongoose.Schema({
//   platformType: { type: String, enum: PLATFORM_TYPES, required: true },
//   taskSubType: { type: String, required: true },
//   claimedDate: { type: Date, required: true },
//   accountUsername: { type: String, required: true },
//   walletAddress: { type: String, required: true },
//   securedSharedData: { type: mongoose.Schema.Types.Mixed, required: true }, // Flexible data
//   sourceUrl: { type: String, required: true }, // URL of the source must be reclaim
// });

// // Compound index for uniqueness
// PlatformTaskSchema.index(
//   { platformType: 1, taskSubType: 1, walletAddress: 1 },
//   { unique: true }
// );

// // Pre-save hook to validate taskSubType and securedSharedData
// PlatformTaskSchema.pre("save", function (next) {
//   // Validate taskSubType against platformType
//   if (!PLATFORM_TASK_SUBTYPES[this.platformType]?.includes(this.taskSubType)) {
//     return next(new Error(`Invalid taskSubType "${this.taskSubType}" for platformType "${this.platformType}"`));
//   }

//   // Validate securedSharedData against the schema for the taskSubType
//   const schemaDefinition = TASK_SUBTYPE_SCHEMAS[this.taskSubType];
//   if (!schemaDefinition) {
//     return next(new Error(`No schema defined for taskSubType "${this.taskSubType}"`));
//   }

//   // Create a validation instance for securedSharedData
//   const validationErrors = [];
//   for (const key in schemaDefinition) {
//     if (schemaDefinition.hasOwnProperty(key)) {
//       const fieldSchema = schemaDefinition[key];
//       const fieldValue = this.securedSharedData[key];

//       if (fieldSchema.required && (fieldValue === undefined || fieldValue === null)) {
//         validationErrors.push(`${key} is required.`);
//       }

//       if (fieldSchema.type && fieldValue && typeof fieldValue !== fieldSchema.type.name.toLowerCase()) {
//         validationErrors.push(`${key} should be of type ${fieldSchema.type.name}.`);
//       }

//       // Additional validation based on field type (e.g., Number or String)
//       if (fieldSchema.type === Number && isNaN(fieldValue)) {
//         validationErrors.push(`${key} should be a valid number.`);
//       }
//     }
//   }

//   if (validationErrors.length > 0) {
//     return next(new Error(`Validation error: ${validationErrors.join(", ")}`));
//   }

//   next();
// });

// // Create and export the model
// export const PlatformTaskModel = mongoose.model("PlatformTask", PlatformTaskSchema);

// // export default PlatformTaskModel;
