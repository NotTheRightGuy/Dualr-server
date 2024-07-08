interface Player {
    username: string;
    rating: number;
}

interface Submission {
    playerId: string;
    code: string;
    token: string;
}

class Room {
    roomId: string;
    player1: Player;
    player2: Player;
    submissions: Submission[] = [];
    constructor() {
        this.roomId = "room1";
        this.player1 = { username: "player1", rating: 1000 };
        this.player2 = { username: "player2", rating: 1000 };
    }

    addSubmission(playerId: string, token: string, code: string) {
        this.submissions.push({
            playerId,
            token,
            code,
        });
    }

    getSubmission(playerId: string) {
        return this.submissions.find(
            (submission) => submission.playerId === playerId
        );
    }

    removeSubmission(token: string) {
        this.submissions = this.submissions.filter(
            (submission) => submission.token !== token
        );
    }
}

export default Room;
