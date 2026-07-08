import chalk from "chalk";
import { isCancel, text } from "@clack/prompts";
import { defaultAgentConfig } from "./types";

export async function runAgentMode(){
    console.log(chalk.bold("Agent based mode is running"))
    const goal = await text({
        message:"What are the tasks you wanted to do?",

        
    })
    if((isCancel(goal)|| !goal.trim())){
        return ;
    }
    const configuration= defaultAgentConfig();
    const tracker =new ActionTracker();

}