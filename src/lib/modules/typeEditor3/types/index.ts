/**
 * TypeEditor3 모듈 기본 타입 정의 (UI Only)
 */

// JSON data type
export type JsonData = Record<string, any>;

// 샘플 데이터
export const sampleJsonData: JsonData = {
  user: {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    profile: {
      age: 30,
      city: "Seoul",
      hobbies: ["reading", "coding", "music"]
    }
  },
  settings: {
    theme: "dark",
    notifications: true,
    language: "ko"
  },
  posts: [
    {
      id: 1,
      title: "First Post",
      content: "Hello World!",
      tags: ["intro", "hello"]
    },
    {
      id: 2,
      title: "Second Post", 
      content: "Learning TypeScript",
      tags: ["typescript", "learning"]
    }
  ]
};