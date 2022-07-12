/**
 * @fileoverview get traffic statistics and policy state of Quantumult X.
 *
 * API used: get_traffic_statistics, get_policy_state.
 *
 * @supported Quantumult X (v1.0.28-build631) iOS 13.0 +
 */

const msgTraffic = {
    action: "get_traffic_statistics"
};

const msgPolicy = {
    action: "get_policy_state"
};

$configuration.sendMessage(msgTraffic).then(resolve => {

    if (resolve.ret) {
        respBody = {}
        respBody['traffic'] = resolve.ret

        $configuration.sendMessage(msgPolicy).then(resolve => {

            if (resolve.ret) {
                respBody['policy'] = resolve.ret

                var json = JSON.stringify(respBody, null, 2);
                const myResponse = {
                    status: "HTTP/1.1 200 OK",
                    headers: { "Content-Type": "application/json" },
                    body: json
                };

                $done(myResponse);
            }
            else { // !msgPolicy -> resolve.ret
                $done("{}");
            }
        });
    }
    else { // !msgTraffic -> resolve.ret
        $done("{}");
    }
});

