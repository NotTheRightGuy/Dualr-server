interface Player {
    username: string;
    userId: string;
    rating: number;
    socketId: string | null;
    testCasesPassed: number;
}

interface Submission {
    userId: string;
    token: string;
}

class Room {
    roomId: string;
    player1: Player;
    player2: Player;
    submissions: Submission[];

    constructor(player1: Player, player2: Player, roomId: string) {
        this.player1 = player1;
        this.player2 = player2;
        this.roomId = roomId;
        this.submissions = [];
    }
}

export default Room;
