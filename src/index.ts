import {app} from "./main/app";
import {SETTING} from "./main/setting"
import {addRoutes} from "./main/routes";
import {db} from "./db/mongo-db";

const start = async  () =>{
    addRoutes(app);

    await db.run();

    app.listen(SETTING.PORT, () => {
        console.log(`Example app listening on port ${SETTING.PORT}`)
    })

}

start();