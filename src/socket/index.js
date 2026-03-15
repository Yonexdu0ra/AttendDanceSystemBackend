import { redisSub } from "../configs/redisClient.js";
import { authenticateSocket } from "../middlewares/auth.middleware.js";
import { getManagersByJobId } from '../services/job.service.js'
function socketHandler(io) {
    console.log('Websocket running...');

    io.use(authenticateSocket)

    io.on("connection", async (socket) => {
        try {
            // mỗi socket sẽ join vào một room có tên là userId để dễ dàng gửi tin nhắn riêng cho từng user
            socket.join(socket.user._id.toString());

            // đưa các quản lý của ca làm việc vòa 1 room để nhận chung thông báo về ca làm việc đó
            if (socket.user.role === "MANAGER" || socket.user.role === "ADMIN") {
                const managedJobs = await getManagersByJobId(socket.user.id);
                for (const job of managedJobs) {
                    socket.join(`job_${job._id.toString()}`);
                }
            }
        } catch (error) {
            return
        }
    })

    io.on("disconnect", (socket) => {
        io.leave(socket.user._id.toString());
    })

    io.on("error", (err) => {
        console.error("Socket.IO error:", err);
    });


    const handleRedisMessage = (message, channel) => {
        try {
            const parsedMessage = JSON.parse(message);
            const { room, event, data } = parsedMessage;
            
            if (room) {
                // Gửi tới 1 room cụ thể (vd: userId hoặc jobId)
                io.to(room.toString()).emit(event, data);
            } else {
                // Broadcast cho tất cả client
                io.emit(event, data);
            }
        } catch (error) {
             console.error(`Error parsing message from channel ${channel}:`, error);
        }
    };

    redisSub.pSubscribe("attendance:*", handleRedisMessage)

    redisSub.pSubscribe("notification:*", handleRedisMessage)

    redisSub.pSubscribe("user:*", handleRedisMessage)

    redisSub.pSubscribe("leave:*", handleRedisMessage)

    redisSub.pSubscribe("overtime:*", handleRedisMessage)
}

export default socketHandler;