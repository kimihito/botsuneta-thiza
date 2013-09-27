class CreateSubscribers < ActiveRecord::Migration
  def change
    create_table :subscribers do |t|
      t.text :email
      t.timestamps
    end
  end
end
