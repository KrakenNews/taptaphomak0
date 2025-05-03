import tkinter as tk
from tkinter import messagebox
import threading
import time

class TapKrakenApp:
    def __init__(self, root):
        self.root = root
        self.root.title("TapKraken 🐙")
        self.root.geometry("600x400")
        self.root.resizable(False, False)

        self.score = 0
        self.energy = 5000
        self.tap_power = 2
        self.is_running = True

        # Метка для очков
        self.score_label = tk.Label(root, text=f"Очки: {self.score}", font=("Arial", 24), fg="green")
        self.score_label.pack(pady=20)

        # Метка для энергии
        self.energy_label = tk.Label(root, text=f"Энергия: {self.energy}", font=("Arial", 24), fg="blue")
        self.energy_label.pack(pady=20)

        # Кнопка для "тапов"
        self.tap_button = tk.Button(root, text="Тап!", font=("Arial", 18), bg="lightblue", command=self.tap)
        self.tap_button.pack(pady=20)

        # Кнопка для выхода
        self.exit_button = tk.Button(root, text="Выход", font=("Arial", 14), bg="red", fg="white", command=self.exit_game)
        self.exit_button.pack(pady=10)

        # Запуск потока для восстановления энергии
        self.energy_thread = threading.Thread(target=self.restore_energy)
        self.energy_thread.daemon = True
        self.energy_thread.start()

    def tap(self):
        if self.energy > 0:
            self.score += self.tap_power
            self.energy -= 10
            self.update_labels()
        else:
            messagebox.showwarning("Нет энергии!", "Энергия закончилась! Подождите восстановления.")

    def restore_energy(self):
        while self.is_running:
            if self.energy < 5000:
                self.energy += 1
                self.update_labels()
            time.sleep(0.5)

    def update_labels(self):
        self.score_label.config(text=f"Очки: {self.score}")
        self.energy_label.config(text=f"Энергия: {self.energy}")

    def exit_game(self):
        self.is_running = False
        self.root.destroy()

if __name__ == "__main__":
    root = tk.Tk()
    app = TapKrakenApp(root)
    root.mainloop()