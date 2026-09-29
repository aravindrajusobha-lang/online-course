const { spawn } = require('node:child_process');
const path = require('node:path');

let shuttingDown = false;
const projects = [
  { name: 'backend', directory: 'server' },
  { name: 'frontend', directory: 'client' },
];

const children = projects.map(({ name, directory }) => {
  const child = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, directory),
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  child.on('error', (error) => {
    console.error(`[${name}] ${error.message}`);
    stop(1);
  });

  child.on('exit', (code) => {
    if (!shuttingDown) {
      console.error(`[${name}] exited${code === null ? '' : ` with code ${code}`}`);
      stop(code || 1);
    }
  });

  return child;
});

function stop(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  process.exitCode = exitCode;
  for (const child of children) child.kill();
}

process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());