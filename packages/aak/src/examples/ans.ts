import { executeAgent } from '../app';

const task = "I want the Aptos Name 'antikythera.apt'";

executeAgent(task)
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
