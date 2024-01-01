// ======================== [Importing Module] ========================
import readline from 'readline';
import db from './config/database.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Application's menu
const menu = ['Create a new task', 'Remove existing task', 'Show my task(s)'];

// Functions
function main() {
    console.log('============ [To Do List App] ============');
    displayMenu();
    usersOption();
}

function displayMenu() {
    let counter = 1;
    for (let i = 0; i < menu.length; i++) {
        console.log(`${counter}. ${menu[i]}`);
        counter++;
    }
}

function usersOption() {
    rl.question(">> Input the number of option: ", answer => {
        // Parsing data type of answer to number
        const parsedAnswer = Number(answer);
        // Handle user's option
        switch (parsedAnswer) {
            case 1:
                rl.question('>> Input detail task: ', answer => {
                    addTask(answer, result => {
                        (result > 0) ? console.log("[INFO] New task has successfully added!\n") : console.error('[ERROR] There\'s an error while inserting task to database');
                        main();
                    });
                });
                break;
            case 2:
                displayTasks((datas) => {
                    console.log("\n============ [My Tasks] ============");
                    let counter = 1;
                    for(let i = 0; i < datas.length; i++) {
                        console.log(`${counter}. ${datas[i].detail_task}`);
                        counter++;
                    }
                    rl.question('>> Input the number of task that you want to removed: ', ans => {
                        const parsedAnswer = Number(ans);
                        if (parsedAnswer < 1 || parsedAnswer > datas.length) return console.log("[ERROR] Invalid task number");
                        removeTask(datas[parsedAnswer-1].detail_task, result => {
                            (result > 0) ? console.log("[INFO] Task has successfully removed\n") : console.log("[ERROR] Failed to remove task from list\n");
                            main();
                        })
                    })
                })
                break;
            case 3:
                displayTasks((datas) => {
                    console.log("\n============ [My Tasks] ============");
                    let counter = 1;
                    for(let i = 0; i < datas.length; i++) {
                        console.log(`${counter}. ${datas[i].detail_task}`);
                        counter++;
                    }
                    console.log('\n');
                    main();
                });
                break;
            default:
                console.error("ERROR: Invalid option");
                usersOption();
                break;
        }
    });
}

function addTask(newTask, callback) {
    db.query(`INSERT INTO tasks (detail_task) VALUES ('${newTask}')`, (err, results) => {
        if (err) return console.log(err);
        return callback(results.affectedRows);
    });
}

function removeTask(taskName, callback) {
    db.query(`DELETE FROM tasks WHERE detail_task = '${taskName}'`, (err, results) => {
        if (err) return console.error(err);
        return callback(results.affectedRows);
    });
} 

function displayTasks(callback) {
    db.query("SELECT * from tasks", (err, results) => {
        if (err) return console.error(err);
        if (results.length > 0) {
            callback(results);
        } else {
            console.log('[INFO] You haven\'t task on list\n');
            main();
        }
    });
}

// Application start
db.connect(err => {
    if (err) {
        console.log(err);
        process.exit();
    } else {
        main();
    }
})