const first = {
    terminal01: 'yarn init --yes',
    terminal02: 'yarn add express',
    terminal03: 'yarn add nodemon --dev',
    terminal04: 'yarn add typescript ts-node @types/node @types/express --dev',
    terminal05: 'yarn tsc --init',
    terminal06: "yarn add dotenv --dev",
    terminal07: 'yarn add nodemailer',
    terminal08: 'yarn add cookie-parser',
    terminal09: 'yarn add @types/cookie-parser --dev',
    terminal10: 'yarn add mongoose'
}
// 1.6 предпочтительное содержимое tsconfig.json
//  {
//  "compilerOptions": {
//    "target": "es2016",
//    "module": "commonjs",
//    "outDir": "./dist",
//    "strict": true,
//    "noImplicitReturns": true,
//    "esModuleInterop": true,
//    "allowSyntheticDefaultImports": true,
//    "skipLibCheck": true,
//    "forceConsistentCasingInFileNames": true
//  },
//  "include": ["src/**/*"],
//"exclude": ["node_modules", "**/*.test.ts"]
// 1.7 в package.json добавляем scripts:
//     "scripts": {
//     "dev": "yarn nodemon --inspect dist/index.js",
//         "watch": "tsc -w"
// },

const forTest = {
    terminal01: 'yarn add jest ts-jest @types/jest supertest @types/supertest',
    terminal02: 'yarn ts-jest config:init'
}

//добавить ещё один скрипт для теста
//"jest": "jest -i"

// yarn add express-valodator


//запуск монго демона:
// Зайти в папку bin, создать внутри подпапки data/db;
// В папке bin запустить 2 терминала;
// В одном терминале стартануть сервер командой (❗прописываем путь руками, иначе могут возникнуть ошибки):
// ./mongod --dbpath ./data/db
// 📋
// Во втором терминале подключиться к серверу:
//     ./mongo