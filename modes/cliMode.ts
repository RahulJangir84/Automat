import { select, isCancel } from "@clack/prompts";
import chalk from "chalk";
import { runAgentMode } from "./agent/orchestrator";

export async function runCliMode(){
    while(true){
        const mode= await select({
            message:"Choose CLI sub-mode",
            options:[
                {value:"agent", label:"Agent based mode"},
                {value:"plan", label:"Plan based mode"},
                {value:"ask", label:"Ask a question"},
                {value:"back", label:"Go Back"}
            ]
        })

        if((isCancel(mode))|| mode==='back'){
            return ;
        }
        if(mode==="agent"){
            await runAgentMode();
        }
        else if(mode==="plan"){
            console.log(chalk.blue('\nPlan based mode'))
        }
        else if(mode==="ask"){
            console.log(chalk.blue('\nAsk mode'))
            
        }
        else{
            console.log(chalk.yellow('\n choose a valid mode'));
        }
    }
}