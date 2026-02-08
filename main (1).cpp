#include <iostream>
#include <fstream>
#include <iomanip>
#include <string>
using namespace std;

// MenuItem class
class MenuItem {
private:
    string name;
    float price;
public:
    MenuItem(string n = "Unknown", float p = 0.0) : name(n), price(p) {}
    void display() const {
        cout << "Menu Item: " << name << " | Price: Rs" << fixed << setprecision(2) << price << endl;
    }
    string getName() const { return name; }
    float getPrice() const { return price; }
};

// Table class
class Table {
private:
    int tableNumber;
    bool reserved;
    string reservedBy; // stored internally
public:
    Table(int num = 0, bool res = false, string user = "")
        : tableNumber(num), reserved(res), reservedBy(user) {}

    void reserve(const string& username) {
        reserved = true;
        reservedBy = username;
        cout << " Table " << tableNumber << " reserved successfully!\n";
    }

    void cancel() {
        if (reserved) {
            cout << " Table " << tableNumber << " reservation cancelled.\n";
            reserved = false;
            reservedBy = "";
        } else {
            cout << " Table " << tableNumber << " is not reserved.\n";
        }
    }

    bool isReserved() const { return reserved; }
    string getReservedBy() const { return reservedBy; }
    int getTableNumber() const { return tableNumber; }

    static void saveTables(Table tables[], int size) {
        ofstream file("tables.txt");
        if (file) {
            for (int i = 0; i < size; i++)
                file << tables[i].getTableNumber() << " "
                     << tables[i].isReserved() << " "
                     << tables[i].getReservedBy() << endl;
            file.close();
        }
    }

    static void loadTables(Table tables[], int size) {
        ifstream file("tables.txt");
        if (file) {
            int num; bool res;
            string user;
            int i = 0;
            while (file >> num >> res) {
                getline(file, user);
                if (!user.empty() && user[0] == ' ') user = user.substr(1);
                tables[i] = Table(num, res, user);
                i++;
                if (i >= size) break;
            }
            file.close();
        }
    }
};

// User class
class User {
protected:
    string username;
    string password;
public:
    User(string u = "guest", string p = "password") : username(u), password(p) {}
    virtual bool login(const string& u, const string& p) {
        return (username == u && password == p);
    }
    virtual void displayInfo() const {
        cout << "Welcome, " << username << " (User)!\n";
    }
};

// Admin class
class Admin : public User {
public:
    Admin() : User("admin", "1234") {}
    bool login(const string& u, const string& p) override {
        return (u == username && p == password);
    }
    void displayInfo() const override {
        cout << "Welcome, " << username << " (Admin)!\n";
    }
};

// Billing class
class Billing {
public:
    static float calculateTotal(float subtotal) {
        return subtotal + subtotal * 0.05 + subtotal * 0.10;
    }
    static void showBill(float subtotal) {
        float tax = subtotal * 0.05;
        float service = subtotal * 0.10;
        float total = subtotal + tax + service;
        cout << "\n----- Bill Details -----\n";
        cout << "Subtotal: Rs" << fixed << setprecision(2) << subtotal << endl;
        cout << "Tax (5%): Rs" << tax << endl;
        cout << "Service Charge (10%): Rs" << service << endl;
        cout << "Total Amount: Rs" << total << endl;
        cout << "------------------------\n";
    }
};

// Feedback class
class Feedback {
private:
    string message;
public:
    Feedback(string msg = "") : message(msg) {}
    void saveFeedback() {
        ofstream file("feedback.txt", ios::app);
        if (file) {
            file << message << endl;
            file.close();
            cout << "Feedback saved successfully.\n";
        }
    }
    static void loadFeedback() {
        ifstream file("feedback.txt");
        if (!file) {
            cout << " No feedback available yet.\n";
            return;
        }
        string line;
        cout << "\n----- All Feedback -----\n";
        while (getline(file, line))
            cout << "- " << line << endl;
        cout << "------------------------\n";
        file.close();
    }
};

// Display menu items
void displayMenu(MenuItem menu[], int size) {
    cout << "\n----- Menu -----\n";
    for (int i = 0; i < size; i++) {
        cout << (i + 1) << ". ";
        menu[i].display();
    }
    cout << "----------------\n";
}

// Reserve table (user)
bool reserveTable(Table tables[], int size, const string& username) {
    int t;

    cout << "\n----- Tables -----\n";
    for (int i = 0; i < size; i++)
        cout << "Table " << tables[i].getTableNumber()
             << (tables[i].isReserved() ? " - Reserved" : " - Available") << endl;

    cout << "Enter table number to reserve (1-" << size << "): ";
    cin >> t;

    if (t <= 0 || t > size) {
        cout << " Invalid table number!\n";
        return false;
    }

    if (tables[t - 1].isReserved()) {
        cout << " Table " << t << " is already reserved!\n";
        return false;
    }

    tables[t - 1].reserve(username);
    Table::saveTables(tables, size);
    return true;
}

// Cancel table reservation (admin)
void cancelTable(Table tables[], int size) {
    cout << "\n----- Reserved Tables -----\n";
    bool anyReserved = false;
    for (int i = 0; i < size; i++)
        if (tables[i].isReserved()) {
            cout << "Table " << tables[i].getTableNumber() << " is reserved.\n";
            anyReserved = true;
        }
    if (!anyReserved) {
        cout << "No tables to cancel.\n";
        return;
    }

    int t;
    cout << "Enter table number to cancel reservation: ";
    cin >> t;

    if (t > 0 && t <= size) {
        tables[t - 1].cancel();
        Table::saveTables(tables, size);
    } else {
        cout << " Invalid table number!\n";
    }
}

// User order actions
void userActions(string username, MenuItem menu[], int menuSize) {
    string itemsOrdered = "";
    float subtotal = 0;
    char addMore;

    do {
        int index;
        cout << "\nEnter item number: ";
        cin >> index;

        if (cin.fail()) {
            cin.clear();
            cin.ignore(1000, '\n');
            cout << " Invalid input! Please enter a number.\n";
            continue;
        }

        if (index > 0 && index <= menuSize) {
            itemsOrdered += menu[index - 1].getName() + ", ";
            subtotal += menu[index - 1].getPrice();
        } else {
            cout << " Invalid choice! Please try again.\n";
            continue;
        }

        cout << "Add more? (y/n): ";
        cin >> addMore;
    } while (addMore == 'y' || addMore == 'Y');

    Billing::showBill(subtotal);

    float finalTotal = Billing::calculateTotal(subtotal);
    ofstream file("orders.txt", ios::app);
    if (file) {
        file << username << " | " << itemsOrdered << " | Rs" << fixed << setprecision(2) << finalTotal << endl;
        file.close();
        cout << " Order saved successfully!\n";
    }
}

// Admin actions
void adminActions(MenuItem menu[], int menuSize, Table tables[], int tableCount) {
    int choice;
    do {
        cout << "\n----- Admin Menu -----\n";
        cout << "1. Display Menu\n2. View Reserved Tables\n";
        cout << "3. Cancel Table Reservation\n4. View Orders\n5. View Feedback\n6. Exit Admin Menu\nEnter choice: ";
        cin >> choice;

        switch (choice) {
            case 1: displayMenu(menu, menuSize); break;
            case 2: {
                cout << "\n----- Reserved Tables -----\n";
                bool anyReserved = false;
                for (int i = 0; i < tableCount; i++)
                    if (tables[i].isReserved()) {
                        cout << "Table " << tables[i].getTableNumber() << " is reserved.\n";
                        anyReserved = true;
                    }
                if (!anyReserved) cout << "No tables are reserved.\n";
                cout << "----------------------------\n";
                break;
            }
            case 3: cancelTable(tables, tableCount); break;
            case 4: {
                ifstream file("orders.txt");
                if (!file) cout << " No orders found!\n";
                else {
                    string line;
                    cout << "\n----- All Orders -----\n";
                    while (getline(file, line)) cout << line << endl;
                    cout << "----------------------\n";
                    file.close();
                }
                break;
            }
            case 5: Feedback::loadFeedback(); break;
            case 6: cout << "Exiting admin mode...\n"; break;
            default: cout << "Invalid choice!\n";
        }
    } while (choice != 6);
}

// Main
int main() {
    MenuItem menuItems[100];
    int numMenuItems = 0;
    menuItems[numMenuItems++] = MenuItem("Biryani", 625);
    menuItems[numMenuItems++] = MenuItem("Burger", 300);
    menuItems[numMenuItems++] = MenuItem("Pasta", 250);
    menuItems[numMenuItems++] = MenuItem("Salad", 400);
    menuItems[numMenuItems++] = MenuItem("Soda", 120);

    Table tables[5] = { Table(1), Table(2), Table(3), Table(4), Table(5) };
    Table::loadTables(tables, 5);

    string role;
    cout << "Are you logging in as (user/admin): ";
    cin >> role;

    string username, password;
    cout << "Enter username: ";
    cin >> username;
    cout << "Enter password: ";
    cin >> password;

    if (role == "admin" || role == "Admin") {
        Admin admin;
        if (admin.login(username, password)) {
            admin.displayInfo();
            adminActions(menuItems, numMenuItems, tables, 5);
        } else cout << "Incorrect admin credentials!\n";
    } 
    else if (role == "user" || role == "User") {
        User user(username, password);
        user.displayInfo();

        char reserveChoice;
        cout << "\nDo you want to reserve a table? (y/n): ";
        cin >> reserveChoice;

        bool proceedToOrder = true;
        if (reserveChoice == 'y' || reserveChoice == 'Y')
            proceedToOrder = reserveTable(tables, 5, username);

        if (proceedToOrder) {
            displayMenu(menuItems, numMenuItems);
            userActions(username, menuItems, numMenuItems);

            string feedbackMsg;
            cout << "\nEnter your feedback: ";
            cin.ignore();
            getline(cin, feedbackMsg);
            Feedback(feedbackMsg).saveFeedback();

            cout << "\nThank you for visiting our restaurant!\n";
        } else {
            cout << "Cannot proceed to order because table reservation failed.\n";
        }
    } 
    else cout << "Invalid role entered!\n";

    return 0;
}