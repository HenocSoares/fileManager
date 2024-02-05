import fs from 'fs';
import os from 'os';
import crypto from 'crypto';
import zlib from 'zlib';

const args = process.argv.slice(2);
const usernameIndex = args.indexOf('--username');
const username = args[usernameIndex + 1];
console.log(`Welcome to the File Manager, ${username}!`);

const main = () => {
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', (input) => {
        const [command, ...params] = input.trim().split(' ');
        executeCommand(command, params);
    });
    console.log(`You are currently in ${process.cwd()}`);
};

const executeCommand = (command, params) => {
    switch (command) {
        case 'up':
            navigateUp();
            break;
        case 'cd':
            navigateToDirectory(params[0]);
            break;
        case 'ls':
            listDirectory();
            break;
        case 'cat':
            readFile(params[0]);
            break;
        case 'add':
            createFile(params[0]);
            break;
        case 'rn':
            renameFile(params[0], params[1]);
            break;
        case 'cp':
            copyFile(params[0], params[1]);
            break;
        case 'mv':
            moveFile(params[0], params[1]);
            break;
        case 'rm':
            deleteFile(params[0]);
            break;
        case 'os':
            getOSInfo(params[0]);
            break;
        case 'hash':
            calculateHash(params[0]);
            break;
        case 'compress':
            compressFile(params[0], params[1]);
            break;
        case 'decompress':
            decompressFile(params[0], params[1]);
            break;
        default:
            console.log('Invalid input');
    }
};

const navigateUp = () => {
    const currentPath = process.cwd();
    const parentPath = path.resolve(currentPath, '..');
    if (parentPath !== currentPath) {
        process.chdir(parentPath);
        console.log(`You are currently in ${parentPath}`);
    }
};

const navigateToDirectory = (directory) => {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.log('Operation failed');
        } else {
            process.chdir(directory);
            console.log(`You are currently in ${directory}`);
        }
    });
};

const listDirectory = () => {
    fs.readdir(process.cwd(), (err, files) => {
        if (err) {
            console.log('Operation failed');
        } else {
            const sortedFiles = files.sort();
            console.log('| **Index** | **Name**            | **Type**     |');
            console.log('|-----------|---------------------|--------------|');
            sortedFiles.forEach((file, index) => {
                const stats = fs.statSync(file);
                const type = stats.isDirectory() ? 'directory' : 'file';
                console.log(`| ${index}         | '${file}'              | '${type}'  |`);
            });
        }
    });
};

const readFile = (filePath) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.log('Operation failed');
        } else {
            console.log(data);
        }
    });
};

const createFile = (fileName) => {
    fs.writeFile(fileName, '', (err) => {
        if (err) {
            console.log('Operation failed');
        }
    });
};

const renameFile = (oldName, newName) => {
    fs.rename(oldName, newName, (err) => {
        if (err) {
            console.log('Operation failed');
        }
    });
};

const copyFile = (source, destination) => {
    fs.copyFile(source, destination, (err) => {
        if (err) {
            console.log('Operation failed');
        }
    });
};

const moveFile = (source, destination) => {
    fs.rename(source, destination, (err) => {
        if (err) {
            console.log('Operation failed');
        }
    });
};

const deleteFile = (fileName) => {
    fs.unlink(fileName, (err) => {
        if (err) {
            console.log('Operation failed');
        }
    });
};

const getOSInfo = (param) => {
    switch (param) {
        case '--EOL':
            console.log(os.EOL);
            break;
        case '--cpus':
            console.log(os.cpus());
            break;
        case '--homedir':
            console.log(os.homedir());
            break;
        case '--username':
            console.log(os.userInfo().username);
            break;
        case '--architecture':
            console.log(process.arch);
            break;
        default:
            console.log('Invalid input');
    }
};

const calculateHash = (filePath) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => {
        hash.update(data);
    });
    stream.on('end', () => {
        console.log(hash.digest('hex'));
    });
};

const compressFile = (source, destination) => {
    const gzip = zlib.createGzip();
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(destination);
    readStream.pipe(gzip).pipe(writeStream);
};

const decompressFile = (source, destination) => {
    const gunzip = zlib.createGunzip();
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(destination);
    readStream.pipe(gunzip).pipe(writeStream);
};

main();