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


    redisSub.pSubscribe("attendance:*", (message, channel) => {
        
     })

    redisSub.pSubscribe("notification:*", (message, channel) => { })

    redisSub.pSubscribe("user:*", (message, channel) => { })

    redisSub.pSubscribe("leave:*", (message, channel) => { })

    redisSub.pSubscribe("overtime:*", (message, channel) => { })
}

export default socketHandler;