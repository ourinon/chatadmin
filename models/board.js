module.exports = (sequelize,DataTypes) => {
    return sequelize.define('board',{
        boardName:{
            type:DataTypes.STRING(100),
            allowNull:false,
        },
        isUseYN:{
            type:DataTypes.BOOLEAN,
            allowNull:false
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