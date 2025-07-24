// export const execute = async function (db, sql) {
// 	return (new Promise( function (resolve, reject) {
// 			db.exec(sql, function (err) {
// 				if (err)
// 					reject(err);
// 				resolve();
// 			});
// 		}));
// }

export async function execute(db, sql)
{
	return (new Promise( function(resolve, reject)
    {
        db.exec(sql, function(error)
        {
            if (error)
                reject(error);
            else
                resolve();
        });
    }));
}