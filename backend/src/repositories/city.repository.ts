import { db } from './../db/index'

import type { City, Cities } from '@ag-resourse-logistic/core'

class CityRepository {
  save(city: City): Promise<City> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ id: '1', presentation: 'test' })
      }, 200)
    }) // return new Promise((resolve, reject) => {
    //   connection.query<OkPacket>(
    //     "INSERT INTO Citys (title, description, published) VALUES(?,?,?)",
    //     [city.title, city.description, city.published ? city.published : false],
    //     (err, res) => {
    //       if (err) reject(err);
    //       else
    //         this.retrieveById(res.insertId)
    //           .then((City) => resolve(City!))
    //           .catch(reject);
    //     }
    //   );
    // });
  }

  retrieveAll(searchParams: { presentation?: string; published?: boolean }): Promise<Cities> {
    return db<City>('cities')
      .select('*')
      .modify((queryBuilder) => {
        if (searchParams.presentation) {
          queryBuilder.whereLike('presentation', `${'%' + searchParams.presentation + '%'}`)
        }
      })

    // return db('cities').select().from<City>('cities')
    // .select('*')
    // .
    // .then((cities) => {})
    // if (searchParams?.presentation) condition += `LOWER(name) LIKE '%${searchParams.presentation}%'`

    // if (condition.length) query += ' WHERE ' + condition

    // return new Promise((resolve, reject) => {
    //   connection.query<Cities>(query, (err, res) => {
    //     if (err) reject(err)
    //     else resolve(res)
    //   })
    // })
  }

  retrieveById(CityId: number): Promise<City> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ id: '1', presentation: 'test' })
      }, 200)
    })
    // return new Promise((resolve, reject) => {
    //   connection.query<Cities>(
    //     "SELECT * FROM Citys WHERE id = ?",
    //     [CityId],
    //     (err, res) => {
    //       if (err) reject(err);
    //       else resolve(res?.[0]);
    //     }
    //   );
    // });
  }

  update(City: City): Promise<number> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1)
      }, 200)
    })
    // return new Promise((resolve, reject) => {
    //   connection.query<OkPacket>(
    //     "UPDATE Citys SET title = ?, description = ?, published = ? WHERE id = ?",
    //     [City.title, City.description, City.published, City.id],
    //     (err, res) => {
    //       if (err) reject(err);
    //       else resolve(res.affectedRows);
    //     }
    //   );
    // });
  }

  delete(CityId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1)
      }, 200)
    })
    // return new Promise((resolve, reject) => {
    //   connection.query<OkPacket>(
    //     "DELETE FROM Citys WHERE id = ?",
    //     [CityId],
    //     (err, res) => {
    //       if (err) reject(err);
    //       else resolve(res.affectedRows);
    //     }
    //   );
    // });
  }

  deleteAll(): Promise<number> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1)
      }, 200)
    })
    // return new Promise((resolve, reject) => {
    //   connection.query<OkPacket>("DELETE FROM Citys", (err, res) => {
    //     if (err) reject(err);
    //     else resolve(res.affectedRows);
    //   });
    // });
  }
}

export default new CityRepository()
