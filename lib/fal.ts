import { fal } from "@fal-ai/client";

export const imageGen = async ({prompt, loraId}: {prompt: string, loraId: string}) => {
    try{
        const result = await fal.subscribe("fal-ai/flux-lora", {
            input: {
            model_name: null,
            prompt:`${prompt}`,
            "loras": [{
                "path": loraId,
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

        return result
    } catch(e){
        console.log(e)
    }
};
