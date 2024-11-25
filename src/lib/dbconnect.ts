import mongoose from 'mongoose';

type connectionObject = {
    isConnected?: number
}

const connection : connectionObject = {}

// we have to make this fxn is async

export async function dbconnect(): Promise<void> {
    // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnected) {
    console.log('Already connected to the database');
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || '' , {})
    // FOR THE READY STATE 
    connection.isConnected = db.connections[0].readyState

    console.log("the DB is connected succesfully")
  } catch (error) {
    console.log("the DB connection is failed "  , error )
    // exit the whole pagw is thewe is connection error 
        process.exit(1);
  }
}