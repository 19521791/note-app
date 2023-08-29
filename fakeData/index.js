export default {
    authors: [
        {
            id: 123,
            name: "Nguyen",
        },
        {
            id: 99,
            name: "Long",
        }
    ],
    folders: [
        {
            id: "1",
            name: 'Long dep dai',
            createdAt: '2023-08-18T03:42:12Z',
            authorId: 123,
        },
        {
            id: "2",
            name: 'Queen',
            createdAt: '2023-08-20T02:42:12Z',
            authorId: 99,
        },
        {
            id: "3",
            name: 'King',
            createdAt: '2023-08-10T01:42:12Z',
            authorId: 123,
        },
    ],
    notes: [
        {
          id: "123",
          content: '<p>Go to supermarket</p>',
          folderId: "1"
        },
        {
          id: "234",
          content: '<p>Go to park</p>',
          folderId: "1"
        },
        {
          id: "123",
          content: '<p>Go to school</p>',
          folderId: "2"
        }
      ]
}