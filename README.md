# Castlewars

**This is a feature-rich clone of the popular online strategy game Travian.**

https://github.com/evgeniylapta/castlewars/assets/8464396/0c4a7789-bcf5-4e04-8285-eace3366f2f5

Technologies Used:

**Frontend:**
- TypeScript
- React
- Next.js
- React-query
- SCSS

**Backend:**
- TypeScript
- Node.js
- Express
- Prisma ORM
- PostgreSQL

**Other:**
- Nx
- docker
- docker-compose
- Feature-Sliced Design

*It is designed as an isomorphic application, with shared utils that can be used both on the frontend and backend.*

**Features:**
- **Authorization with access and refresh tokens**. Token-based authentication for secure login.
- **User registration**. New users can register to access the game.
- **Bot users generation via admin interface** Admins have the ability to generate new bot users.
- **Map settlement**. New users or bots are placed on the map in a sequential order, starting from the center and expanding outward.
- **Map navigation**. Navigate the game map with expand/collapse functionality.
- **Castle information**. View detailed information about a castle, including tribe type (Romans, Gauls, or Teutons), the number of troops and gold.
- **Tribe types**. Each tribe type has its own unique troop types with different attributes such as attack, defense, and recruitment cost and speed.
- **Real-time gold generation**.
- **Troop sending**. Players can send troops from one castle to another, selecting the type and number of troops to send, as well as the target castle. The game calculates the distance and arrival time of the troops.
- **Troop return**. Return troops to the player's castle after an attack in real time.
- **Troop movement status**. Provide updates on troop movements.
- **Loss calculation**. Calculate troop losses based on a formula when troops reach an enemy castle, taking into account various factors such as troop types, attack and defense values. This calculation is processed in real-time.
- **Troop ordering**. Order new troops using gold with real-time processing.
- **Bot actions scheduler**. Bots order and send troops to nearby castles in real time.
- **Admin and user roles**. Role-based access control where admins can view information about other castles.
- **Attack history**. The application keeps a record of past attacks.
- **Socket integration for real-time updates**. Real-time updates are facilitated through socket integration, allowing players to see changes instantly.

**To run the game:**
- Call **"npm run prod:docker:start"** from the root directory of the project.
- Wait for all containers to finish deployment
- Access the game through **"localhost:3000"** in a web browser. 
