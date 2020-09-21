import minimist from 'minimist'
import { promises as fs } from 'fs'

interface Command {
  name: string
  function: (args: string[]) => void;
}

async function executeCommand (command: string, args: string[]): Promise<void> {
  const commands: Command[] = (await fs.readdir(`${__dirname}/commands`))
    .map((file: string) => {
      return {
        name: file.replace(/\.ts/g, ''),
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        function: (require(`${__dirname}/commands/${file}`)).default
      }
    })
  commands.map(cmd => {
    if (cmd.name === command) {
      cmd.function(args)
    }
  })
}

function app () {
  const args = minimist(process.argv.slice(2))
  executeCommand(args._.shift() ?? '', args._)
}

app()
