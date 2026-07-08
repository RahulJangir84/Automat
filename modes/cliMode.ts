import chalk from "chalk"
import {select,isCancel} from "@clack/prompts"

export async function runClimode(){
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
            console.log(chalk.blue('\nAgent based mode'))
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