import { executeAgent } from '../app';

const task = 'I want to swap 1 APT into MOD';

executeAgent(task)
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
