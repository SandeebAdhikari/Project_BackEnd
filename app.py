from flask import Flask, jsonify
from flask_mysqldb import MySQL # type: ignore
from flask_cors import CORS # type: ignore //cross orgin resource sharing 
from dotenv import load_dotenv
import os
import MySQLdb.cursors  #type: ignore

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = os.getenv("MYSQL_HOST")
app.config['MYSQL_USER'] = os.getenv("MYSQL_USER")
app.config['MYSQL_PASSWORD'] = os.getenv("MYSQL_PASSWORD")
app.config['MYSQL_DB'] = os.getenv("MYSQL_DATABASE")  # fixed key

mysql = MySQL(app)

@app.route('/top-films', methods=['GET'])
def top_films():
    query = """
    SELECT f.film_id,
           f.title,
           c.name AS category,
           COUNT(r.rental_id) AS rented
    FROM film f
    JOIN film_category fc ON f.film_id = fc.film_id
    JOIN category c ON fc.category_id = c.category_id
    JOIN inventory i ON f.film_id = i.film_id
    JOIN rental r ON i.inventory_id = r.inventory_id
    GROUP BY f.film_id, f.title, c.name
    ORDER BY rented DESC
    LIMIT 5;
    """
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)  # type: ignore
    cursor.execute(query) # type: ignore
    rows = cursor.fetchall() # type: ignore
    cursor.close() # type: ignore
    return jsonify(rows)


if __name__ == "__main__":
    app.run(debug=True)
