module.exports = (sequelize, DataTypes) => {

    //chattingservice 테이블과 맵핑되는 chattingservice모델 정의
    return sequelize.define('chattingservice', {
        userID: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        chatRoomName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        chatRoomDescription: {
            type: DataTypes.STRING(1000),
            allowNull: false
        },
        serviceDomain: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        counselor: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        counselorID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        themeCode: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        targetID: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        userLimits: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        imageFullPath: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        openState: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        appOpenState: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        autoClosedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        realClosedAt: {
            type: DataTypes.DATE,
            allowNull: true,
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