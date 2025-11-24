import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://eugeniatamborelli_db_user:clusterone@cluster0.xds5mff.mongodb.net/?appName=Cluster0";

export const connectDB = async () => {
    if (!MONGODB_URI) {
        console.error('Error: MONGODB_URI no definida en .env');
        process.exit(1); 
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Conexión exitosa a MongoDB Atlas');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1); 
    }
};