import "@stdlib/deploy";

contract PingPong with Deployable {

    id: Int as uint32;
    owner: Address;

    init(id: Int) {
        self.owner = sender();
        self.id = id;
    }

    receive() {
        // receive money
    }

    receive("withdraw") {
        require(sender() == self.owner, "only owner can call this");
        send(SendParameters{
            to: sender(),
            bounce: true,
            value: myBalance() - context().value - ton("0.01"),
            mode: SendRemainingValue + SendIgnoreErrors
        });
    }

    receive("ping") {
        let ctx: Context = context();
        require(ctx.value > 0, "Insufficient balance");
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: "pong".asComment()
        });
    }


    get fun id(): Int {
        return self.id;
    }

    get fun balance(): String {
        return myBalance().toCoinsString();
    }
}
