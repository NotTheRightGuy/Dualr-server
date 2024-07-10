const onGoingSubmission = new Map<
    string,
    {
        user_id: string;
        socket_id: string;
        test_case_number: number;
    }
>();

export default onGoingSubmission;
