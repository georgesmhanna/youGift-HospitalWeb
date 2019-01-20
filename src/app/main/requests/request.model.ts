export class Request {
    id: string;
    type: string;
    quantity: string;
    date: string;
    description: string;
    replies: number;
    bloodType: string;
    status: boolean;
    issuer: {};

    /**
     * Constructor
     *
     * @param request
     */
    constructor(request) {
        {
            this.id = request.id;
            this.type = request.type;
            this.quantity = request.quantity;
            this.date = request.date;
            this.replies = request.replies;
            this.bloodType = request.bloodType;
            this.status = request.status;
            this.issuer = request.issuer;
            this.description = request.description;

        }
    }
}
