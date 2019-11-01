const fs = require('fs');
const path = require('path');

const prompts = require('prompts');
const mustache = require('mustache');
const glob = require('glob');
const rimraf = require('rimraf');
const appsPath = process.cwd();
const templatePath = path.resolve(__dirname, '../template');

function createApp({
	appName,
	routerComponent,
	stateManagement,
	middleware,
}) {
	if (!appName) {
		return;
	}
	const appPath = path.join(appsPath, appName);
	const templateAppPath = path.join(templatePath, 'app');

	const templateProps = {
		appName: appName,
		useRedux: stateManagement !== 'mobx',
		routerComponent: routerComponent || 'App',
		useRouter: routerComponent === 'Routers',
	};
	const generateFile = (relativePath, file) => {
		const content = mustache.render(fs.readFileSync(file, 'utf8'), templateProps);
		const targetFilePath = path.join(appPath, relativePath);

		fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });
		fs.writeFileSync(targetFilePath, content, 'utf8');

		console.log(`generate ${path.join(appName, relativePath)}`);
	};

	const reduxPath = '/src/browser/redux';

	try {
		const ignoreFiles = [path.join(templateAppPath, reduxPath, '/**/*')];

		if (!(routerComponent === 'Routers')) {
			ignoreFiles.push(path.join(templateAppPath, '/src/browser/routers.js'));
		}
		glob
			.sync(path.join(templateAppPath, '**/*'), {
				nodir: true,
				ignore: ignoreFiles,
			})
			.forEach(file => {
				const fileRelativePath = path.relative(templateAppPath, file);

				generateFile(fileRelativePath, file);
			});

		// generate redux
		let reduxAndMiddleWare = '';

		if (stateManagement === 'redux') {
			reduxAndMiddleWare = middleware || 'basic';
		} else {
			reduxAndMiddleWare = stateManagement === 'rematch' ? 'rematch' : 'basic';
		}

		glob
			.sync(path.join(templateAppPath, reduxPath, reduxAndMiddleWare, '**/*'), {
				nodir: true,
			})
			.forEach(file => {
				const fileRelativePath = path.relative(
					`${templateAppPath}/${reduxPath}/${reduxAndMiddleWare}`,
					file,
				);
				const targetFileRelativePath = path.join(reduxPath, fileRelativePath);

				generateFile(targetFileRelativePath, file);
			});
	} catch (error) {
		console.error(error);
		console.log('it seems like something went wrong');
		console.log('reversing changes...');

		rimraf.sync(appPath);
		console.log('reversed successfully, nothing changed');
	}
}

async function cli() {
	const questions = [
		{
			type: 'text',
			name: 'appName',
			message: 'Please input app name, e.g. BookList, ShoppingMall ',
		},
		{
			type: 'select',
			name: 'routerComponent',
			message: 'Need router?',
			choices: [{ title: 'yes', value: 'Routers' }, { title: 'no', value: 'App' }],
		},
		{
			type: 'select',
			name: 'stateManagement',
			message: 'Pick a state management',
			choices: [
				{ title: 'Redux', value: 'redux' },
				{ title: 'Rematch', value: 'rematch' },
			],
		},
	];
	const response = await prompts(questions);

	let middlewareObj = {};

	if (response.stateManagement === 'redux') {
		middlewareObj = await prompts([
			{
				type: 'select',
				name: 'middleware',
				message: 'Pick a middleware',
				choices: [{ title: 'Thunk', value: 'thunk' }, { title: 'Saga', value: 'saga' }],
			},
		]);
	}

	createApp({ ...response, ...middlewareObj });
}

module.exports = {
	cli,
	createApp,
};
