export const ONBOARD_LIST_ONE = {
    mainText: "Pick Your Team. They get early, VIP access to your posts.",
    infoText:
        "Pick people you trust to see your raw content. Nobody besides them will be able to see it at first.",
};

export const ONBOARD_LIST_TWO = {
    mainText: "Bursts push your posts beyond Your Team.",
    infoText:
        "If enough of Your Team taps “Burst” on your post, it launches publicly and others on the platform can see it.",
};

export const ONBOARD_LIST_THREE = {
    mainText: "Pick Your Team",
    infoText:
        "Invite at least three trusted people to your team to help you share your post across channels.",
};

export const ONBOARD_LIST_MAIN = [
    "Your Team are people you trust to get early, VIP access to your posts",
    "Your Team decides which Channels to share your post with.",
    "Your Team offers a safe, supportive space for testing and feedback.",
    "☆ Burst a post to share it with new audiences",
];
export const ONBOARD_LIST_SUB = [
    "Your new posts are private and only seen by Your Team.",
    "Your Team can ☆ Burst your post into channels that they think would love the content",
    "Your Team offers a safe, supportive space for testing and feedback.",
    "If you see content that others would love, use ☆ Burst to Share it with a new Channel",
];

export const InvitationStatus = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    IGNORED: "ignored",
    LEAVE: "leave",
};

export const TEAM_SWITCH_TYPES = [
    { id: 0, label: "Your Team" },
    { id: 1, label: "Add to Your Team" },
];

export const NotificationTypes = {
    SHAREERT: "SHAREERT",
    BURST: "BURST",
    LIKE: "LIKE",
    INVITE: "INVITE",
    REACTION: "REACTION",
    COMMENT: "COMMENT",
    REPLY: "REPLY",
    QUOTE: "QUOTE",
    ADDCHANNEL: "ADDCHANNEL",
    REMOVECHANNEL: "REMOVECHANNEL",
    CHANNEL: "CHANNEL",
    EVERYONE: "EVERYONE",
    ACCEPT: "ACCEPT",
};

export const Categories = {
    all: {
        symbol: null,
        name: "All",
    },
    //   history: {
    //     symbol: "🕘",
    //     name: "Recently used",
    //   },
    emotion: {
        symbol: "😀",
        name: "Smileys & Emotion",
    },
    people: {
        symbol: "🧑",
        name: "People & Body",
    },
    nature: {
        symbol: "🦄",
        name: "Animals & Nature",
    },
    food: {
        symbol: "🍔",
        name: "Food & Drink",
    },
    activities: {
        symbol: "⚾️",
        name: "Activities",
    },
    places: {
        symbol: "✈️",
        name: "Travel & Places",
    },
    objects: {
        symbol: "💡",
        name: "Objects",
    },
    symbols: {
        symbol: "🔣",
        name: "Symbols",
    },
    flags: {
        symbol: "🏳️‍🌈",
        name: "Flags",
    },
    return: {
        symbol: "✖️",
        name: "Return",
    },
};

export const NotificationData = [
    {
        id: 0,
        createdAt: "2024-03-12T11:56:06.610Z",
        type: "shareERT",
        body: "shared a new post with you as her Early Release Team. Go check it!",
        fromUser: {
            displayName: "Temp Name",
            id: 6,
            profileImageKey:
                "image-uploads/55832c83-3cde-4d63-9d93-33467a8f31d9.jpg",
        },
        status: true,
    },
    {
        id: 1,
        createdAt: "2024-03-13T11:56:06.610Z",
        type: "like",
        body: "liked your post",
        fromUser: {
            displayName: "Temp Name",
            id: 6,
            profileImageKey:
                "image-uploads/55832c83-3cde-4d63-9d93-33467a8f31d9.jpg",
        },
        status: true,
        post: {
            createdAt: "2024-03-11T11:56:06.610Z",
            id: 23,
            media: [
                {
                    createdAt: "2024-02-06T11:56:06.638Z",
                    id: 8,
                    key: "image-uploads/35B78F63-36DD-42EB-B1F7-6E532548E227.jpg",
                    order: 0,
                    type: "image",
                    updatedAt: "2024-02-06T11:56:06.638Z",
                },
            ],
            text: "here is a long long comment versione is a long long comment versione is a long long comment versione is a long long comment version",
        },
    },

    {
        id: 2,
        createdAt: "2024-03-11T11:56:06.610Z",
        type: "burst",
        status: true,
        body: "Your post burst out from your Early Release Team to go public!",
        post: {
            createdAt: "2024-03-11T11:56:06.610Z",
            id: 23,
            media: [
                {
                    createdAt: "2024-02-06T11:56:06.638Z",
                    id: 8,
                    key: "image-uploads/35B78F63-36DD-42EB-B1F7-6E532548E227.jpg",
                    order: 0,
                    type: "image",
                    updatedAt: "2024-02-06T11:56:06.638Z",
                },
            ],
            text: "here is a long long comment version",
        },
    },
    {
        id: 3,
        createdAt: "2024-03-11T11:56:06.610Z",
        type: "invite",
        body: "invited you to join their Early Release Team.",
        fromUser: {
            displayName: "Temp Name",
            id: 6,
            profileImageKey:
                "image-uploads/55832c83-3cde-4d63-9d93-33467a8f31d9.jpg",
        },
        status: true,
    },
    {
        id: 4,
        createdAt: "2024-03-11T11:56:06.610Z",
        type: "reaction",
        body: "reacted 👍 to your post.",
        fromUser: {
            displayName: "Temp Name",
            id: 6,
            profileImageKey:
                "image-uploads/55832c83-3cde-4d63-9d93-33467a8f31d9.jpg",
        },
        status: true,
        post: {
            createdAt: "2024-03-11T11:56:06.610Z",
            id: 23,
            media: [
                {
                    createdAt: "2024-02-06T11:56:06.638Z",
                    id: 8,
                    key: "image-uploads/35B78F63-36DD-42EB-B1F7-6E532548E227.jpg",
                    order: 0,
                    type: "image",
                    updatedAt: "2024-02-06T11:56:06.638Z",
                },
            ],
            text: "here is a long long comment version",
        },
    },
    {
        id: 5,
        createdAt: "2024-02-11T11:56:06.610Z",
        type: "comment",
        body: "commented on your post:",
        fromUser: {
            displayName: "Temp Name",
            id: 6,
            profileImageKey:
                "image-uploads/55832c83-3cde-4d63-9d93-33467a8f31d9.jpg",
        },
        status: true,
        post: {
            createdAt: "2024-03-11T11:56:06.610Z",
            id: 23,
            media: [
                {
                    createdAt: "2024-02-06T11:56:06.638Z",
                    id: 8,
                    key: "image-uploads/35B78F63-36DD-42EB-B1F7-6E532548E227.jpg",
                    order: 0,
                    type: "image",
                    updatedAt: "2024-02-06T11:56:06.638Z",
                },
            ],
            text: "here is a long long comment version",
        },
    },
    {
        id: 6,
        createdAt: "2024-03-5T11:56:06.610Z",
        type: "reply",
        body: "replied to your comment: ",
        fromUser: {
            displayName: "Temp Name",
            id: 6,
            profileImageKey:
                "image-uploads/55832c83-3cde-4d63-9d93-33467a8f31d9.jpg",
        },
        status: true,
        post: {
            createdAt: "2024-03-11T11:56:06.610Z",
            id: 23,
            media: [
                {
                    createdAt: "2024-02-06T11:56:06.638Z",
                    id: 8,
                    key: "image-uploads/35B78F63-36DD-42EB-B1F7-6E532548E227.jpg",
                    order: 0,
                    type: "image",
                    updatedAt: "2024-02-06T11:56:06.638Z",
                },
            ],
            text: "here is a short comment version",
        },
    },
];

export const InvitationData = [
    {
        id: 0,
        createdAt: "2024-03-12T11:56:06.610Z",
        fromUser: {
            displayName: "Temp Name",
            id: 6,
            profileImageKey:
                "image-uploads/55832c83-3cde-4d63-9d93-33467a8f31d9.jpg",
        },
    },
    {
        id: 1,
        createdAt: "2024-03-12T11:56:06.610Z",
        fromUser: {
            displayName: "Temp Name",
            id: 6,
            profileImageKey:
                "image-uploads/55832c83-3cde-4d63-9d93-33467a8f31d9.jpg",
        },
    },
    {
        id: 2,
        createdAt: "2024-03-12T11:56:06.610Z",
        userName: "",
        fromUser: {
            displayName: "LongLongName",
            id: 6,
            profileImageKey:
                "image-uploads/55832c83-3cde-4d63-9d93-33467a8f31d9.jpg",
        },
    },
    {
        id: 3,
        createdAt: "2024-03-12T11:56:06.610Z",
        fromUser: {
            displayName: "LongLongName2",
            id: 6,
            profileImageKey:
                "image-uploads/55832c83-3cde-4d63-9d93-33467a8f31d9.jpg",
        },
    },
];
