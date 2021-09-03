const express = require('express'),
      connectToMongo = require('./db'),
      authRoutes = require('./routes/auth'),
      notesRoutes = require('./routes/notes'),
      app = express()
      
app.use(express.json());

//connection to mongoDB
connectToMongo();

//available routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);


app.listen(3000, () => {
    console.log("listening in port 3000");
})

