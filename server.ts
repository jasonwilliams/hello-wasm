import {
	createConnection,
	ProposedFeatures,
	InitializeParams,
	TextDocumentSyncKind,
	InitializeResult
} from 'vscode-languageserver/node';

class ServerImpl {
	instance: any;

	constructor(instance: any) {
		this.instance = instance;
	}

	public static async instantiate(): Promise<ServerImpl> {
		try {
			const mod = await import('./dist/hello_wasm');
			return new ServerImpl(mod);
		} catch (e) {
			throw new Error(e);
		}
	}

	public greeting(): String {
        return this.instance.greeting();
	}
}

let impl: ServerImpl;
let connection = createConnection(ProposedFeatures.all);

connection.onInitialize((params: InitializeParams) => {
	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
		}
	};
	return ServerImpl.instantiate()
		.then((loadedImpl: ServerImpl) => {
			impl = loadedImpl;
			return result;
		});
});

connection.onInitialized(() => {
	connection.window.showInformationMessage(`greeting: ${impl.greeting()}`);
});

connection.listen();