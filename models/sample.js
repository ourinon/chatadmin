module.exports = (sequelize, DataTypes) => {

    //sample 테이블과 맵핑되는 sample모델 정의
    return sequelize.define('sample', {
        boardname: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        desc: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        useyn: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        createduid: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    }, {
        timestamps: true,
        paranoid: true
    });

    //timestamps 는 물리적 테이블 createdAt,updatedAt컬럼을 자동추가하고
    //데이터 신규생성일시,수정일시 데이터를 자동으로 마킹해줍니다.
    //paranoid가 트루이면 deletedAt컬럼이 자동추가되고
    //삭제시 삭제일시정보가 자동 마킹되고 데이터는 실제 삭제되지 않습니다.

};