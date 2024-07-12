import winston from "winston";

const authLogger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: "auth-service" },
    transports: [
        new winston.transports.File({
            filename: "logs/auth/error.log",
            level: "error",
        }),
        new winston.transports.File({ filename: "logs/auth/combined.log" }),
    ],
});

const matchmakingLogger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: "matchmaking-service" },
    transports: [
        new winston.transports.File({
            filename: "logs/matchmaking/error.log",
            level: "error",
        }),
        new winston.transports.File({
            filename: "logs/matchmaking/combined.log",
        }),
    ],
});

const socketLogger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: "socket-service" },
    transports: [
        new winston.transports.File({
            filename: "logs/socket/error.log",
            level: "error",
        }),
        new winston.transports.File({
            filename: "logs/socket/combined.log",
        }),
    ],
});

if (process.env.NODE_ENV !== "production") {
    authLogger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
    matchmakingLogger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
    socketLogger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

export { authLogger, matchmakingLogger, socketLogger };
