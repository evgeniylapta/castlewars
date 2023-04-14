# Castlewars

**This is a simple clone of the popular online strategy game Travian.**

Features:

- Map navigation: Navigate the game map with expand/collapse functionality.
- Castle information: Players can view detailed information about a castle, including tribe type (Romans, Gauls, or Teutons), the number of troops and gold.
- Tribe types: Each tribe type has its own unique troop types with different attributes such as attack, defense, and recruitment cost and speed.
- Real-time gold generation.
- Troop sending: Players can send troops from one castle to another, selecting the type and number of troops to send, as well as the target castle. The game calculates the distance and arrival time of the troops.
- Troop return: Return troops to the player's castle after an attack in real time.
- Loss calculation: Calculate troop losses based on a formula when troops reach an enemy castle, taking into account various factors such as troop types, attack and defense values. This calculation is processed in real-time.
- Troop movement status: Provide updates on troop movements, including en route and returning troops.
- Troop ordering: Order new troops using gold with real-time processing.
- Map settlement with Bots: Sequentially fill map sectors with bots instead of random placement.
- Bot simple AI: Simple bot AI that can order and send troops to nearby castles in real time.

To run the game, simply call **"docker-compose up"** from the root directory of the project. Wait for all containers to finish deployment, and then access the game through **"localhost:3000"** in your web browser. 
