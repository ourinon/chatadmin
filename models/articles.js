module.exports = (sequelize,DataTypes) => {
    return sequelize.define('articles',{
        // boardIDX:{
        //     type:DataTypes.INTEGER,
        //     allowNull:false,
        // },
        articleTypeCode:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        title:{
            type:DataTypes.STRING(500),
            allowNull:false,
        },
        tags:{
            type:DataTypes.STRING(500),
            allowNull:true,
        },
        contents:{
            type:DataTypes.TEXT,
            allowNull:false,
        },
        parentArticleIDX:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        viewCount:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        displayYn:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
        },
        iPAddress:{
            type:DataTypes.STRING(20),
            allowNull:false,
        },
        extra1:{
            type:DataTypes.STRING(500),
            allowNull:true,
        },
        extra2:{
            type:DataTypes.STRING(500),
            allowNull:true,
        },
        createdUID:{
            type:DataTypes.STRING(100),
            allowNull:false,
        },
        updatedUID:{
            type:DataTypes.STRING(100),
            allowNull:false,
        },
        deletedUID:{
            type:DataTypes.STRING(100),
            allowNull:true,
        },
    },{
        timestamp:true,
        paranoid:true
    })
}