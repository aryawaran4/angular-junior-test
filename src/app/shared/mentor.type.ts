export interface MentorType {
    id: string,
    email: string,
    civility: string,
    first_name: string,
    last_name: string,
    company: {
        name: string,
        user_type: string
    },
    user_status: string,
    count_document: number
}