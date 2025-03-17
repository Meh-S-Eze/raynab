// chat/CommandInterpreter.ts

// This is a simplified example. A real implementation would involve more sophisticated NLP.
export class CommandInterpreter {
  public interpret(command: string): { controller: string; action: string; args: any } | null {
    command = command.toLowerCase();

    if (command.includes('show budget summary')) {
      return { controller: 'Budget', action: 'getBudget', args: {} };
    } else if (command.includes('create transaction')) {
      // Example: create transaction for $50 at grocery store in food category
      const match = command.match(/create transaction for \$(\d+\.?\d*) at (.*) in (.*) category/);
      if (match) {
        const amount = parseFloat(match[1]);
        const payee = match[2].trim();
        const category = match[3].trim();
        return { controller: 'Transaction', action: 'createTransaction', args: { amount, payee, category } };
      }
    } else if (command.includes('show accounts')) {
      return { controller: 'Account', action: 'getAccounts', args: {} };
    }

    return null;
  }
}
