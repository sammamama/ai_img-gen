import { fal } from "@fal-ai/client";

export const imageGen = async ({prompt, loraPath}: {prompt: string, loraPath: string}) => {
    try{
        const result = await fal.subscribe("fal-ai/flux-lora", {
            input: {
            model_name: null,
            prompt:`${prompt}`,
            "loras": [{
                "path": loraPath,
                "scale": 1
            }],
            },
            logs: false,
            // onQueueUpdate: (update) => {
            // if (update.status === "IN_PROGRESS") {
            //     update.logs.map((log) => log.message).forEach(console.log);
            // }
            // },
        });

        return {"success": true, ...result}
    } catch(e){
        console.log(e)
    }
};
