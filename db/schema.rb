# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160118052351) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "admin_about_mes", force: :cascade do |t|
    t.string   "storypic"
    t.string   "story_title"
    t.text     "story"
    t.string   "progressbar_title"
    t.text     "progressbar_description"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  create_table "admin_clients", force: :cascade do |t|
    t.string   "name"
    t.string   "clientpic"
    t.string   "trustper"
    t.text     "feedback"
    t.string   "contact_details"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  create_table "admin_contact_infos", force: :cascade do |t|
    t.text     "embed_url"
    t.string   "email1"
    t.string   "email2"
    t.integer  "phone1_code"
    t.string   "phone1_number"
    t.integer  "phone2_code"
    t.string   "phone2_number"
    t.string   "name"
    t.string   "add_line1"
    t.string   "add_line2"
    t.string   "add_line3"
    t.string   "city"
    t.string   "state"
    t.string   "country"
    t.string   "mobile1"
    t.string   "mobile2"
    t.string   "facebook_url"
    t.string   "twitter_url"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "admin_events", force: :cascade do |t|
    t.text     "title"
    t.text     "description"
    t.date     "event_date_from"
    t.date     "event_date_to"
    t.datetime "start_time"
    t.datetime "end_time"
    t.text     "location"
    t.text     "summery"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "eventpic"
  end

  create_table "admin_galleries", force: :cascade do |t|
    t.string   "title"
    t.string   "pic"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "admin_scustservices", force: :cascade do |t|
    t.string   "title"
    t.string   "description"
    t.integer  "service_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "admin_services", force: :cascade do |t|
    t.string   "service_title"
    t.string   "service_caption"
    t.string   "tp_title"
    t.string   "tp_caption"
    t.string   "cust_title"
    t.string   "cust_caption"
    t.text     "cust_descrption"
    t.string   "notice_board_title"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
  end

  create_table "admin_sharevideos", force: :cascade do |t|
    t.text     "embed"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "admin_smedialists", force: :cascade do |t|
    t.string   "title"
    t.string   "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "service_id"
  end

  create_table "admin_snotices", force: :cascade do |t|
    t.string   "description"
    t.integer  "service_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "admin_sthirdparties", force: :cascade do |t|
    t.string   "tppic"
    t.string   "title"
    t.string   "description"
    t.integer  "service_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "admin_welcomedata", force: :cascade do |t|
    t.string   "title"
    t.string   "description"
    t.string   "picture"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "sthirdparties", force: :cascade do |t|
    t.string   "tppic"
    t.string   "title"
    t.string   "description"
    t.integer  "service_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "username"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
