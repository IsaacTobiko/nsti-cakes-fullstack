from locust import HttpUser, task, between 

class Shopper(HttpUser):
    wait_time = between(1,3)

    @task(5)
    def browse(self):
        self.client.get("/products/")

    @task(1)
    def view_one(self):
        self.client.get("/products/1")