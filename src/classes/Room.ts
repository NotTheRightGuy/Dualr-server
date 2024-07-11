interface Player {
    username: string;
    userId: string;
    rating: number;
    socketId: string | null;
    testCasesPassed: number;
}

class Room {
    roomId: string;
    player1: Player;
    player2: Player;
    submissions: Map<
        string,
        {
            socket_id: string;
            input_number: number;
        }
    >;
    question: any; //TODO : Set proper type of question
    startTime: number;

    constructor(
        player1: Player,
        player2: Player,
        roomId: string,
        questionSlug: any
    ) {
        this.player1 = player1;
        this.player2 = player2;
        this.roomId = roomId;
        this.submissions = new Map<
            string,
            {
                socket_id: string;
                input_number: number;
            }
        >();
        this.question = questionSlug;
        this.startTime = Date.now();
    }
}

export { Room, Player };
