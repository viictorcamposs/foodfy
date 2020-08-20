const db = require ( '../../config/db' )

module.exports = { 
    home ( callback ) {
        db.query (`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON ( recipes.chef_id = chefs.id )`, ( err, results ) => {
            if ( err ) throw `Database Error! ${ err }`
            callback ( results.rows )
        })
    },
    findby ( params ) {
        const { filter, callback } = params
        db.query (`
        SELECT *, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON ( recipes.chef_id = chefs.id )
        WHERE recipes.title ILIKE '%${ filter }%'
        OR chefs.name ILIKE '%${ filter }%'`,
        ( err, results ) => {
            if ( err ) throw `Database Error! ${ err }`
            callback ( results.rows )
        })
    },
    about ( callback ) { 
        const data = [
            {
                class: "about",
                title: "Sobre o Foodfy",
                paragraph: "Suspendisse placerat neque neque. Morbi dictum nulla non sapien rhoncus, et mattis erat commodo. Aliquam vel lacus a justo mollis luctus. Proin vel auctor eros, sed eleifend nunc. Curabitur eget tincidunt risus. Mauris malesuada facilisis magna, vitae volutpat sapien tristique eu. Morbi metus nunc, interdum in erat placerat, aliquam iaculis massa. Duis vulputate varius justo pharetra maximus. In vehicula enim nec nibh porta tincidunt. Vestibulum at ultrices turpis, non dictum metus. Vivamus ligula ex, semper vitae eros ut, euismod convallis augue.",
                paragraph2: "Fusce nec pulvinar nunc. Duis porttitor tincidunt accumsan. Quisque pulvinar mollis ipsum ut accumsan. Proin ligula lectus, rutrum vel nisl quis, efficitur porttitor nisl. Morbi ut accumsan felis, eu ultrices lacus. Integer in tincidunt arcu, et posuere ligula. Morbi cursus facilisis feugiat. Praesent euismod nec nisl at accumsan. Donec libero neque, vulputate semper orci et, malesuada sodales eros. Nunc ut nulla faucibus enim ultricies euismod."
            },
            {
                class: "story",
                title: "Como tudo começou...",
                paragraph: "Suspendisse placerat neque neque. Morbi dictum nulla non sapien rhoncus, et mattis erat commodo. Aliquam vel lacus a justo mollis luctus. Proin vel auctor eros, sed eleifend nunc. Curabitur eget tincidunt risus. Mauris malesuada facilisis magna, vitae volutpat sapien tristique eu. Morbi metus nunc, interdum in erat placerat, aliquam iaculis massa. Duis vulputate varius justo pharetra maximus. In vehicula enim nec nibh porta tincidunt. Vestibulum at ultrices turpis, non dictum metus. Vivamus ligula ex, semper vitae eros ut, euismod convallis augue.",
                paragraph2: "Fusce nec pulvinar nunc. Duis porttitor tincidunt accumsan. Quisque pulvinar mollis ipsum ut accumsan. Proin ligula lectus, rutrum vel nisl quis, efficitur porttitor nisl. Morbi ut accumsan felis, eu ultrices lacus. Integer in tincidunt arcu, et posuere ligula. Morbi cursus facilisis feugiat. Praesent euismod nec nisl at accumsan. Donec libero neque, vulputate semper orci et, malesuada sodales eros. Nunc ut nulla faucibus enim ultricies euismod."
            },
            {
                class: "recipes",
                title: "Nossas receitas",
                paragraph: "Fusce nec pulvinar nunc. Duis porttitor tincidunt accumsan. Quisque pulvinar mollis ipsum ut accumsan. Proin ligula lectus, rutrum vel nisl quis, efficitur porttitor nisl. Morbi ut accumsan felis, eu ultrices lacus. Integer in tincidunt arcu, et posuere ligula. Morbi cursus facilisis feugiat. Praesent euismod nec nisl at accumsan. Donec libero neque, vulputate semper orci et, malesuada sodales eros. Nunc ut nulla faucibus enim ultricies euismod.",
                paragraph2: ""
            }
        ]
        callback ( data )
    },
    all ( callback ) { 
        db.query (`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON ( recipes.chef_id = chefs.id )
        ORDER BY id`, ( err, results ) => {
            if ( err ) `Database Error! ${ err }`
            callback ( results.rows )
        })
    },
    show ( id, callback ) {
        db.query (`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON ( recipes.chef_id = chefs.id )
        WHERE recipes.id = $1`, [id], ( err, results ) => {
            if ( err ) `Database Error! ${ err }`
            callback ( results.rows[0] )
        })
    },
    allChefs ( callback ) {
        db.query (`
        SELECT chefs.*,
        count ( recipes ) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON ( recipes.chef_id = chefs.id )
        GROUP BY chefs.id`, ( err, results ) => {
            if ( err ) `Database Error! ${ err }`
            callback ( results.rows )
        })
    }
}