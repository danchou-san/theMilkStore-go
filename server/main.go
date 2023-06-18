package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Product struct {
	ID      string `bson:"_id" json:"id"`
	Count   int    `bson:"count" json:"count"`
	Results []struct {
		Name    string `bson:"name" json:"name"`
		Type    string `bson:"type" json:"type"`
		Storage int    `bson:"storage" json:"storage"`
		ID      string `bson:"id" json:"id"`
	} `bson:"results" json:"results"`
}

func main() {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}

	collection := client.Database("milkDb").Collection("products")

	http.HandleFunc("/api/products", func(w http.ResponseWriter, r *http.Request) {
		// Enable CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		cur, err := collection.Find(context.TODO(), bson.D{})
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal Server Error"))
			return
		}
		defer cur.Close(context.TODO())

		var products []Product
		for cur.Next(context.TODO()) {
			var product Product
			err := cur.Decode(&product)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte("Internal Server Error"))
				return
			}
			products = append(products, product)
		}
		if err := cur.Err(); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal Server Error"))
			return
		}

		var productData []map[string]interface{}
		for _, p := range products {
			for _, result := range p.Results {
				productMap := map[string]interface{}{
					"id":      p.ID,
					"name":    result.Name,
					"storage": result.Storage,
					"type":    result.Type,
				}
				productData = append(productData, productMap)
			}
		}

		jsonData, err := json.Marshal(productData)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal Server Error"))
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	})

	log.Println("Server is running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
